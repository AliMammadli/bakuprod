import { gsap } from 'gsap'

const content = [
    {
        title: 'Suşi məhsulları',
        desc: 'Suşi və Yapon mətbəxinin təamlarının hazırlanması üçün ən keyfiyyətli məhsullar yalnız "BakuProd"-da'
    },
    {
        title: 'Asiya mətbəxi',
        desc: 'Asiya mətbəxini bizimlə kəşf et'
    },
    {
        title: 'Dəniz məhsulları',
        desc: 'Dəniz və okean delikotesləri yalnız bizdə'
    },
    {
        title: 'Meyvə tərəvəzlər',
        desc: 'Hər mövsümün meyvə-tərəvəzləri bizdə'
    },
    {
        title: 'Süd və yağ məhsulları',
        desc: 'Tam orqanik süd və yağ məhsullarını bir araya topladıq'
    },
    {
        title: 'Souslar',
        desc: 'Təamlarınızı tamamlayan souslar'
    },
    {
        title: 'Un məhsulları',
        desc: 'B qrup vitaminləri ilə zəngin olan ərzaqlarımızı sizlərə təqdim edirik'
    }
]

var index = 1
var angle = 110
const dur = 2

function backClick() {
    if (index > 1) {
        angle -= 360
        gsap.to('#circle', { duration: dur, "--angle": `${angle}deg` })
        gsap.to('#plate', { duration: dur, "--angle": `${-angle}deg` })
        
        index -= 1
        document.querySelector("#slider-title").innerHTML = content[index - 1].title
        document.querySelector("#slider-desc").innerHTML = content[index - 1].desc
        document.querySelector(`#button-${index}`).focus()
        setTimeout(() => {
            document.querySelector("#plate").style.cssText = `background-image: url("assets/images/slider-${index}.webp");`
        }, 350)
    }
}

function forwardClick() {
    if (index < 7) {
        angle += 360
        gsap.to('#circle', { duration: dur, "--angle": `${angle}deg` })
        gsap.to('#plate', { duration: dur, "--angle": `${-angle}deg` })

        index += 1
        document.querySelector("#slider-title").innerHTML = content[index - 1].title
        document.querySelector("#slider-desc").innerHTML = content[index - 1].desc
        document.querySelector(`#button-${index}`).focus()
        setTimeout(() => {
            document.querySelector("#plate").style.cssText = `background-image: url("assets/images/slider-${index}.webp");`
        }, 800)
    }
}

function slideTo(indexTo) {
    if (indexTo !== index) {
        angle -= 360 * (index - indexTo)
        gsap.to('#circle', { duration: dur, "--angle": `${angle}deg` })
        gsap.to('#plate', { duration: dur, "--angle": `${-angle}deg` })

        index = indexTo
        document.querySelector("#slider-title").innerHTML = content[index - 1].title
        document.querySelector("#slider-desc").innerHTML = content[index - 1].desc
        setTimeout(() => {
            document.querySelector("#plate").style.cssText = `background-image: url("assets/images/slider-${index}.webp");`
        }, 800)
    }
}


window.backClick = backClick
window.forwardClick = forwardClick
window.slideTo = slideTo