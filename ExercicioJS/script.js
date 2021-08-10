function MAIOR_MENOR() {
  let maior, menor;
  for (let i = 1; i <= 5; ++i) {
    const valor = prompt(`${i}ª Valor`);
    if (!maior) {
      maior = valor;
      menor = valor;
    }
    valor > maior ? (maior = valor) : 0;
    valor < menor ? (menor = valor) : 0;
  }

  alert(`MENOR: ${menor}\nMAIOR: ${maior}`);
}

function VOGAL() {
  const vogal = prompt("Vogal");
  let regex = new RegExp(/[aeiou]+/gi);
  let hasVogal = vogal.match(regex);

  hasVogal ? alert(1) : alert(0);
}

function LIMITES() {
  const limiteInferior = prompt("Limite inferior");
  const limiteSuperior = prompt("Limite superior");

  let soma = 0;
  const pares = [];
  for (let i = limiteInferior; i < limiteSuperior; i++) {
    if (i % 2 == 0) {
      pares.push(i);
      soma += i;
    }
  }

  alert(`Pares: ${pares}\nSoma: ${soma}`);
}

function ORDEM() {
  let num = [];
  for (let i = 0; i < 3; i++) {
    num[i] = prompt(`${i + 1}ª número`);
  }

  num.sort((a, b) => a - b);
  alert(num);
}

function POSITIVO_NEGATIVO() {
  let valor = prompt("Valor");

  valor > 0 ? alert(true) : alert(false);
}

function PAR_IMPAR() {
  let valor = prompt("Valor");

  valor % 2 == 0 ? alert(true) : alert(false);
}
