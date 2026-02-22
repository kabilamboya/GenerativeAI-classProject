from __future__ import annotations

import json
import logging
import random
from functools import lru_cache
from json import JSONDecodeError
from typing import Any, Callable

from pydantic import ValidationError

from app.config import Settings, get_settings
from app.schemas import BrandingRequest, BrandingResponse

try:
    from openai import OpenAI
except ImportError:  # pragma: no cover
    OpenAI = None

LOGGER = logging.getLogger(__name__)
ALLOWED_PLACEMENTS = ["Front", "Back", "Left Sleeve", "Right Sleeve"]
ClientFactory = Callable[[str], Any]


class BrandingService:
    def __init__(self, settings: Settings, client_factory: ClientFactory | None = None) -> None:
        self.settings = settings
        self.client_factory = client_factory or self._default_client_factory

    def generate(self, request: BrandingRequest) -> BrandingResponse:
        if not self.settings.openai_api_key or OpenAI is None:
            LOGGER.info("Using local fallback because OpenAI client/key is unavailable.")
            return self._local_fallback(request)

        try:
            client = self.client_factory(self.settings.openai_api_key)
            response = client.responses.create(
                model=self.settings.openai_model,
                input=self._build_prompt(request),
                temperature=0.8,
            )
            payload = self._extract_payload(response.output_text or "")
            normalized = self._normalize_payload(payload)
            return BrandingResponse(**normalized)
        except JSONDecodeError:
            LOGGER.warning("OpenAI response was not valid JSON. Falling back to local generation.")
        except (ValidationError, ValueError):
            LOGGER.warning("OpenAI response failed schema validation. Falling back to local generation.")
        except Exception:
            LOGGER.exception("Brand generation failed. Falling back to local generation.")

        return self._local_fallback(request)

    @staticmethod
    def _default_client_factory(api_key: str) -> Any:
        return OpenAI(api_key=api_key)

    @staticmethod
    def _local_fallback(request: BrandingRequest) -> BrandingResponse:
        adjectives = ["Nova", "Bright", "Skyline", "Pulse", "Aero", "Vertex"]
        nouns = ["Thread", "Wear", "Collective", "Studio", "Route", "Labs"]
        slogan_templates = [
            "Built for {idea}",
            "Style that powers {idea}",
            "Wear your {idea}",
            "Where {idea} meets motion",
        ]

        idea_short = request.idea.lower()
        name = f"{random.choice(adjectives)} {random.choice(nouns)}"
        slogan = random.choice(slogan_templates).format(idea=idea_short)

        return BrandingResponse(
            name=name,
            slogan=slogan,
            description=(
                f"A {request.direction.lower()} brand focused on {idea_short}, "
                "with apparel designs that communicate mission and movement."
            ),
            missionStatement=(
                f"Our mission is to accelerate {idea_short} through clear, bold, and useful brand storytelling."
            ),
            placement=random.choice(ALLOWED_PLACEMENTS),
        )

    @staticmethod
    def _build_prompt(request: BrandingRequest) -> str:
        return (
            "You are a branding strategist for startup apparel. "
            "Return only JSON with keys: name, slogan, description, missionStatement, placement. "
            f"Placement must be one of {ALLOWED_PLACEMENTS}. "
            "Constraints: name max 3 words, slogan max 10 words, description max 35 words, missionStatement max 30 words. "
            f"Business idea: {request.idea}. Direction: {request.direction}."
        )

    @staticmethod
    def _extract_payload(raw_text: str) -> dict[str, Any]:
        text = raw_text.strip()

        if text.startswith("```"):
            lines = text.splitlines()
            if lines:
                lines = lines[1:]
            if lines and lines[-1].strip().startswith("```"):
                lines = lines[:-1]
            text = "\n".join(lines).strip()
            if text.lower().startswith("json"):
                text = text[4:].strip()

        data = json.loads(text)
        if not isinstance(data, dict):
            raise JSONDecodeError("Expected JSON object", text, 0)
        return data

    @staticmethod
    def _normalize_payload(payload: dict[str, Any]) -> dict[str, str]:
        normalized = {
            "name": str(payload.get("name", "")).strip(),
            "slogan": str(payload.get("slogan", "")).strip(),
            "description": str(payload.get("description", "")).strip(),
            "missionStatement": str(payload.get("missionStatement", "")).strip(),
            "placement": str(payload.get("placement", "Front")).strip(),
        }

        if normalized["placement"] not in ALLOWED_PLACEMENTS:
            normalized["placement"] = "Front"

        required = ["name", "slogan", "description", "missionStatement"]
        if any(not normalized[field] for field in required):
            raise ValueError("OpenAI payload is missing required fields.")

        return normalized


@lru_cache
def get_branding_service() -> BrandingService:
    return BrandingService(settings=get_settings())
