from fastapi.testclient import TestClient

from app.config import Settings
from app.main import app
from app.schemas import BrandingRequest, BrandingResponse
from app.services.branding import BrandingService


class StubBrandingService:
    def generate(self, request: BrandingRequest) -> BrandingResponse:
        return BrandingResponse(
            name="Vertex Labs",
            slogan="Built for climate teams",
            description="A modern brand focused on climate software.",
            missionStatement="Help teams build climate products faster.",
            placement="Front",
        )

    def generate_image(self, prompt: str) -> str:
        return f"data:image/svg+xml;utf8,{prompt}"


class _FakeResponse:
    output_text = (
        '{"name":"Aero Labs","slogan":"Build bold tools","description":"Great desc",'
        '"missionStatement":"Great mission","placement":"Hat"}'
    )


class _FakeClient:
    class responses:
        @staticmethod
        def create(**kwargs):  # noqa: ANN003
            return _FakeResponse()


def test_health_endpoint() -> None:
    client = TestClient(app)
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_generate_endpoint_with_override() -> None:
    from app.api.routes.branding import get_branding_service

    app.dependency_overrides[get_branding_service] = lambda: StubBrandingService()
    client = TestClient(app)

    response = client.post(
        "/api/branding/generate",
        json={"idea": "AI tutoring", "direction": "Modern"},
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Vertex Labs"

    app.dependency_overrides.clear()


def test_generate_endpoint_invalid_request() -> None:
    client = TestClient(app)
    response = client.post("/api/branding/generate", json={"idea": "  ", "direction": "Bold"})
    assert response.status_code == 422


def test_generate_image_endpoint() -> None:
    from app.api.routes.branding import get_branding_service

    app.dependency_overrides[get_branding_service] = lambda: StubBrandingService()
    client = TestClient(app)

    response = client.post("/api/branding/generate-image", json={"prompt": "Minimal hex logo"})
    assert response.status_code == 200
    assert response.json()["imageDataUrl"].startswith("data:image/")

    app.dependency_overrides.clear()


def test_service_normalizes_invalid_placement() -> None:
    service = BrandingService(
        settings=Settings(openai_api_key="test-key"),
        client_factory=lambda api_key: _FakeClient(),  # noqa: ARG005
    )
    result = service.generate(BrandingRequest(idea="AI tutoring", direction="Bold"))
    assert result.placement == "Front"
