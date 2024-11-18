export default function useFormatRevenues(revenue: any) {
    const result = parseFloat(revenue).toFixed(2);
    return `$ ${result}`
}