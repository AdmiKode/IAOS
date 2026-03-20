import { InsuredClaimsPage } from '@/components/claims/InsuredClaimsPage'

export default function ClientSiniestrosRoute() {
  const mapboxToken =
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
    process.env.MAPBOX_ACCESS_TOKEN ||
    ''

  return <InsuredClaimsPage mapboxToken={mapboxToken} />
}
