import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('cn utility helper', () => {
  it('combines string classes correctly', () => {
    const result = cn('text-red-500', 'bg-blue-200')
    expect(result).toContain('text-red-500')
    expect(result).toContain('bg-blue-200')
  })

  it('handles conditional classes', () => {
    const result = cn(
      'base-class',
      true && 'active-class',
      false && 'inactive-class'
    )
    expect(result).toContain('base-class')
    expect(result).toContain('active-class')
    expect(result).not.toContain('inactive-class')
  })

  it('resolves conflicting tailwind classes using twMerge', () => {
    // twMerge debe resolver valores en conflicto de Tailwind (ej: p-4 vs p-6)
    const result = cn('p-4', 'p-6')
    expect(result).toBe('p-6')
  })

  it('handles empty inputs or undefined', () => {
    const result = cn('p-4', undefined, null, '')
    expect(result).toBe('p-4')
  })
})
