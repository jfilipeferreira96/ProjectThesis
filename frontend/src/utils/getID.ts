export function getId(str: string): string | null {
   const regex = /\/challenge\/([^\/]+)/;
   const match = str.match(regex);
   if (match && match[1]) {
     return match[1];
   } else {
     return null; // Retorna null se não encontrar um ID
   }
}
