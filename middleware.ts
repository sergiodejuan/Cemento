import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Simplemente dejamos que la petición continúe sin hacer nada
  return NextResponse.next()
}
