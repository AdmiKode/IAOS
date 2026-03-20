import { CarrierExecutivePage } from '@/components/insurance/pages/CarrierExecutivePage'

export default function AseguradoraExecutiveRoute() {
  const mapboxToken =
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
    process.env.MAPBOX_ACCESS_TOKEN ||
    ''

  return <CarrierExecutivePage mapboxToken={mapboxToken} />
}
