import { CarrierClaimsPage } from '@/components/insurance/pages/CarrierClaimsPage'

export default function AseguradoraClaimsRoute() {
  const mapboxToken =
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
    process.env.MAPBOX_ACCESS_TOKEN ||
    ''

  return <CarrierClaimsPage mapboxToken={mapboxToken} />
}
