import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EventosController {
    public eventos = {
        1: {
            id: 1,
            nome: "Esportes"
        },
        2: {
            id: 2,
            nome: "Dança",
        }
    }

    public usuario = { 
        foto: "assets/images/estudante.jpg", 
        nome: "Fulano D. Tal", 
        curso: "Ciência da Computação", 
        campus: "Nova Iguaçu - IM", 
        certificados: 32, 
        eventosCriados: 11,
        preferencias: this.eventos
    }

    public async index({view} : HttpContextContract) {
        return view.render('evento/home', { eventos : this.eventos, usuario : this.usuario })
    }

    public async criarEvento({view} : HttpContextContract) {
        return view.render('evento/criarEvento')
    }

}
