from fastapi import APIRouter, Depends

from app.schemas import BrandingRequest, BrandingResponse
from app.services import BrandingService, get_branding_service

router = APIRouter(prefix="/api")


@router.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/branding/generate", response_model=BrandingResponse, tags=["branding"])
async def generate_branding(
    payload: BrandingRequest,
    service: BrandingService = Depends(get_branding_service),
) -> BrandingResponse:
    return service.generate(payload)

