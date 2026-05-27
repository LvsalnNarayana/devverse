/**
 * Stable colour mapping for tag chips. Same tag string always returns the
 * same colour across renders, regardless of theme mode.
 */

const PALETTE = [
    '#6366F1', // indigo
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#F59E0B', // amber
    '#10B981', // emerald
    '#06B6D4', // cyan
    '#F43F5E', // rose
    '#84CC16', // lime
    '#A855F7', // purple
    '#0EA5E9', // sky
    '#EF4444', // red
    '#22C55E', // green
    '#3B82F6', // blue
    '#14B8A6', // teal
]

const hash = (s) => {
    let h = 0
    for (let i = 0; i < s.length; i++) {
        h = (h << 5) - h + s.charCodeAt(i)
        h |= 0
    }
    return Math.abs(h)
}

export const getTagColor = (tag) => {
    if (!tag) return PALETTE[0]
    return PALETTE[hash(String(tag).toLowerCase()) % PALETTE.length]
}
