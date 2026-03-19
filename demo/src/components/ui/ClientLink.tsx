'use client'
import Link from 'next/link'
import { MOCK_CLIENTS } from '@/data/mock'

interface ClientLinkProps {
  name: string
  className?: string
  /** Si true muestra sólo el nombre sin decoración extra */
  plain?: boolean
}

/**
 * Muestra el nombre del cliente como enlace DIRECTO a su expediente (/agent/clientes/[id]).
 * Si no hay coincidencia en MOCK_CLIENTS, renderiza el nombre como texto plano
 * (no redirige al listado — evita confusión con prospectos/usuarios que no son clientes).
 */
export function ClientLink({ name, className = '', plain = false }: ClientLinkProps) {
  const client = MOCK_CLIENTS.find(
    c => c.name.toLowerCase() === name.toLowerCase() ||
         c.name.toLowerCase().includes(name.toLowerCase()) ||
         name.toLowerCase().includes(c.name.toLowerCase())
  )

  // Sin expediente → texto plano, sin link
  if (!client) {
    return <span className={className}>{name}</span>
  }

  const href = `/agent/clientes/${client.id}`

  if (plain) {
    return (
      <Link
        href={href}
        className={`hover:text-[#F7941D] hover:underline transition-colors cursor-pointer ${className}`}
        title={`Ver expediente de ${name}`}
      >
        {name}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 group cursor-pointer ${className}`}
      title={`Ver expediente de ${name}`}
    >
      <span className="group-hover:text-[#F7941D] group-hover:underline transition-colors">
        {name}
      </span>
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        className="opacity-0 group-hover:opacity-100 transition-opacity text-[#F7941D]"
      >
        <path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </Link>
  )
}
