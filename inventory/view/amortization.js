import * as models from "../models/index.js";

const amortization_amount_label = {
  supply: "Custo total",
  recurring: "Custo por mês",
  standalone: "Total gasto",
  regressive: "Total gasto",
};

const amortization_goodThrough_label = {
  supply: "Estoque (ou uso) em meses",
  recurring: "Meses de recorrência",
  standalone: "",
  regressive: "",
};

export const set = (event, modal_type = "expense") => {
  const { value } = event.target;
  const [_, tag] = value.split("_");
  const amortization = models.amortization.fromTag[tag];

  const elAmountLabel = document.querySelector(`label[for="${modal_type}Amount"]`);
  elAmountLabel.innerText = amortization_amount_label[amortization];

  const goodThroughID = `${modal_type}GoodThrough`;
  const elGoodThrough = document.getElementById(goodThroughID);
  const elGoodThroughLabel = document.querySelector(`label[for="${goodThroughID}"]`);
  elGoodThroughLabel.innerText = amortization_goodThrough_label[amortization];

  switch (amortization) {
    case "supply":
      elGoodThroughLabel.style.display = "block";
      elGoodThrough.style.display = "inline-block";
      break;

    case "recurring":
      elGoodThroughLabel.style.display = "block";
      elGoodThrough.style.display = "inline-block";
      break;

    case "standalone":
      elGoodThroughLabel.style.display = "none";
      elGoodThrough.style.display = "none";
      elGoodThrough.value = 1;
      elGoodThrough.dispatchEvent(new Event("input"));
      break;

    case "regressive":
      elGoodThroughLabel.style.display = "none";
      elGoodThrough.style.display = "none";
      elGoodThrough.value = 12;
      elGoodThrough.dispatchEvent(new Event("input"));
      break;
  }
};
