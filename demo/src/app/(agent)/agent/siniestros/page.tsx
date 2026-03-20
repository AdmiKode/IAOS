import { AgentPromotoriaClaimsPage } from '@/components/claims/AgentPromotoriaClaimsPage'

export default function AgentPromotoriaSiniestrosRoute() {
  const mapboxToken =
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
    process.env.MAPBOX_ACCESS_TOKEN ||
    ''

  return <AgentPromotoriaClaimsPage mapboxToken={mapboxToken} />
}
