import "./css/index.css"
import IMask from "imask"

const ccBgColor1 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor2 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436d99", "#2d57f2"],
    mastercard: ["#df6f29", "#c69347"],
    american: ["#1f6cb4", "#fffef8"],
    discover: ["#00A4E0", "#EF4123"],
    jcb: ["#00823f", "#bb1933"],
    default: ["black", "gray"]
  }

  ccBgColor1.setAttribute("fill", colors[type][0])
  ccBgColor2.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}
setCardType("default")

globalThis.setCardType = setCardType // coloquei minha função no global para poder executar ela no browser

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^3[47][0-9]{13}/,
      cardtype: "American"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,
      cardType: "discover"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^6(?:011|5[0-9]{2})[0-9]{12}/,
      cardtype: "Discover"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(?:35\d{0,2})\d{0,12}/,
      cardType: "jcb"
    },

    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"
    }
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")

    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    return foundMask
  }
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)
//number card
cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumberMasked(cardNumberMasked.value)
})
function updateCardNumberMasked(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerHTML = number.length === 0 ? "1234 5678 9012 3456" : number
}

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerHTML =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

document.querySelector("form").addEventListener("submit", event => {
  event.preventDefault()
})

//expiration-date
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    }
  }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)
//experation card
expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})
function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")

  ccExpiration.innerHTML = date.length === 0 ? "02/32" : date
}

//securityCode
const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000"
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)
// cvc card
securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})
function updateSecurityCode(code) {
  const ccSecutiry = document.querySelector(".cc-security .value")
  ccSecutiry.innerHTML = code.length === 0 ? "123" : code
}

// button submit
const addButton = document.querySelector("#add-card")

addButton.addEventListener("click", () => {
  const cardDone = document.querySelector(".cc").innerHTML

  if (securityCode.value === "") {
    alert("Preencher os campos!")
  } else {
    alert("Cartão adicionado!")
    window.print(cardDone)
  }
})
