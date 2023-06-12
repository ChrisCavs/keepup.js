type HeaderMap = {
    name: string;
    pos: number;
}

const getHash = (): string => window.location.hash

const getFullLocation = (): string => window.location.href

const yLocation = (): number => window.scrollY || window.pageYOffset

const isScrolledPast = (pos: number, buffer: number): boolean =>
    pos - buffer < yLocation()

const findEl = (maps: HeaderMap[], hash: string): HeaderMap | undefined =>
    maps.find(({ name }) => `#${name}` === hash)

const findHeaders = (): HTMLElement[] => Array.from(
    document.querySelectorAll<HTMLElement>(
        'h1,h2,h3,h4,h5,h6,[data-keepup]'
    )
)

const mapToPosition = (headers: HTMLElement[]): HeaderMap[] => {
    return headers.map((el) => {
        const pos: number = el.getBoundingClientRect().y
        const name: string = el.innerText
        return { name, pos }
    })
}

const checkForHeader = (maps: HeaderMap[], buffer: number): void => {
    let max = 0
    let result: string | null = null

    maps.forEach(({ name, pos }) => {
        if (isScrolledPast(pos, buffer) && pos > max) {
            max = pos
            result = name
        }
    })

    if (!result) return
    replaceHash(result)
}

const replaceHash = (newHash: string): void => {
    const hash = getHash()
    const updatedLocation = hash
        ? getFullLocation().replace(hash, newHash)
        : getFullLocation() + newHash
    window.location.replace(updatedLocation)
}

const debounce = (maps: HeaderMap[], buffer: number): () => void => {
    let timeout: number
    return () => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(
            () => checkForHeader(maps, buffer),
            200
        )
    }
}

export default (buffer = 100): void => {
    const hash: string = getHash()
    const headers = findHeaders();
    const maps = mapToPosition(headers)
    
    if (hash) {
        const map = findEl(maps, hash)
        if (map) {
            window.scrollTo(0, map.pos + buffer)
        }
    }

    window.addEventListener('scroll', debounce(maps, buffer))
}
