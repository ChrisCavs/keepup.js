type HeaderMap = {
    name: string;
    pos: number;
}

type Options = {
    buffer?: number;
}

const defaultOptions: Options = {
    buffer: 0,
}

const findHeaders = (): HTMLElement[] => {
    const dataNodes = document.querySelectorAll<HTMLElement>('[data-keepup]')
    const nativeHeaders = document.querySelectorAll<HTMLElement>('h1,h2,h3,h4,h5,h6')
    return Array.from(dataNodes).concat(Array.from(nativeHeaders))
};

const mapToPosition = (headers: HTMLElement[]): HeaderMap[] => {
    return headers.map((el) => {
        const pos: number = el.getBoundingClientRect().y
        const name: string = el.innerText
        return {name, pos}
    })
}

const keepup = (options: Options) => {
    const headers = findHeaders();
    const maps = mapToPosition(headers)

    window.addEventListener('scroll', () => {

    })
}

export default (options: Options): void => {
    window.addEventListener('DOMContentLoaded', () => {
        keepup({...defaultOptions, ...options})
    })
}