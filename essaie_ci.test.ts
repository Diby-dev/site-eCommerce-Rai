import { expect, test } from 'vitest'

// Une fonction simple qui simule le calcul d'un prix de t-shirt avec réduction
function calculerTotal(prix: number, quantite: number, remise: number) {
  return (prix * quantite) - remise;
}

// Le test que le robot va exécuter
test('Calcule correctement le total du panier avec une remise', () => {
  const total = calculerTotal(10000, 2, 2000); // 2 t-shirts à 15 000 FCFA moins 2 000 FCFA de réduction
  expect(total).toBe(18000); // On s'attend à ce que le résultat soit strictement 25 000 FCFA
})
