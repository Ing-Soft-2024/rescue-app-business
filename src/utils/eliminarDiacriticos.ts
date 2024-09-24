// Objective: Eliminar los diacríticos de un texto.
export function eliminarDiacriticos(texto: string) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}