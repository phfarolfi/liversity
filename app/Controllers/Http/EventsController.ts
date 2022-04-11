import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
//import User from 'App/Models/User'
import Event from 'App/Models/Event'

export default class EventsController {

    public async eventView({ auth, response, view } : HttpContextContract) {
        await auth.use('web').check()
        if(auth.use('web').isLoggedIn)
            return response.redirect().toRoute('index')

        return view.render('events/CreateEvent')
    }

    public async CreateEvent({/*auth,*/ request, response, session} : HttpContextContract) {
        const { name, eventDate, category,  limitSubscriptionDate , description, linkCommunicationGroup /*,photo, document*/ } = request.all()

        if(!name || !eventDate ||  !category || !limitSubscriptionDate || !description || !linkCommunicationGroup /*|| !photo || !document*/) {
            session.flashExcept(['CreateEvent'])
            session.flash({ errors: { event: 'Preencha todos os campos solicitados' } })
            return response.redirect().toRoute('createEvent')
        }

        try {
            //var user = await User.findBy('email', auth.user!.email) caso coloquemos o organizador no banco como usuário
            await Event.create({ name: name, eventDate: eventDate, initialSubscriptionDate: eventDate, limitSubscriptionDate: limitSubscriptionDate, description: description, categoryId:category, local:'Campus', linkCommunicationGroup: linkCommunicationGroup, photo: "s3://liversity-app/events/photo/md-duran-E0ylfF52C6M-unsplash.jpg", document: "s3://liversity-app/events/photo/md-duran-E0ylfF52C6M-unsplash.jpg", campusId: 1, statusId:1 });
            //await Student.create({ userId: userCreated.id, completedProfile: false })
            response.redirect().toRoute('eventPage')
        } catch {
            session.flashExcept(['CreateEvent'])
            session.flash({ errors: { event: 'Não foi possível realizar o cadastro do evento.' } })

            return response.redirect().toRoute('createEvent')
        }
    }

    public events = {
        1: {
            id: 1,
            name: "Violino",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu scelerisque felis imperdiet proin fermentum leo vel. Ultrices tincidunt arcu non sodales neque. Risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit. Purus sit amet volutpat consequat mauris. Commodo ullamcorper a lacus vestibulum sed arcu non odio. A iaculis at erat pellentesque adipiscing commodo elit.",
            photo: "images/events/evento-violino.jpg",
            date: "30/02/2022",
            subscribersNumber: 5,
            organizer: "Ciclano D. Tal",
            local: "Auditório"
        },
        2: {
            id: 2,
            name: "Dança",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu scelerisque felis imperdiet proin fermentum leo vel. Ultrices tincidunt arcu non sodales neque. Risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit. Purus sit amet volutpat consequat mauris. Commodo ullamcorper a lacus vestibulum sed arcu non odio. A iaculis at erat pellentesque adipiscing commodo elit.",
            photo: "images/events/evento-danca.jpg",
            date: "30/03/2022",
            subscribersNumber: 15,
            organizer: "Ciclana D. Tal",
            local: "Salão de dança"
        },
        3: {
            id: 3,
            name: "Esportes",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu scelerisque felis imperdiet proin fermentum leo vel. Ultrices tincidunt arcu non sodales neque. Risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit. Purus sit amet volutpat consequat mauris. Commodo ullamcorper a lacus vestibulum sed arcu non odio. A iaculis at erat pellentesque adipiscing commodo elit.",
            photo: "images/events/evento-esporte.jpg",
            date: "30/04/2022",
            subscribersNumber: 20,
            organizer: "Fulana D. Tal",
            local: "Quadra"
        }
    }

    public subscribers = {
        1: {
            id: 1,
            photo: "images/users/estudante.jpg", 
            name: "Fulano D. Tal", 
            course: "Ciência da Computação", 
            campus: "Nova Iguaçu - IM", 
            certificatesNumber: 32, 
            eventsCreated: 11,
            preferences: this.events
        },
        2: {
            id: 2,
            photo: "images/users/estudante.jpg", 
            name: "Fulano D. Tal", 
            course: "Ciência da Computação", 
            campus: "Nova Iguaçu - IM", 
            certificatesNumber: 32, 
            eventsCreated: 11,
            preferences: this.events
        },
        3: {
            id: 3,
            photo: "images/users/estudante.jpg", 
            name: "Fulano D. Tal", 
            course: "Ciência da Computação", 
            campus: "Nova Iguaçu - IM", 
            certificatesNumber: 32, 
            eventsCreated: 11,
            preferences: this.events
        },
        4: {
            id: 4,
            photo: "images/users/estudante.jpg", 
            name: "Fulano D. Tal", 
            course: "Ciência da Computação", 
            campus: "Nova Iguaçu - IM", 
            certificatesNumber: 32, 
            eventsCreated: 11,
            preferences: this.events
        },
        5: {
            id: 5,
            photo: "images/users/estudante.jpg", 
            name: "Fulano D. Tal", 
            course: "Ciência da Computação", 
            campus: "Nova Iguaçu - IM", 
            certificatesNumber: 32, 
            eventsCreated: 11,
            preferences: this.events
        }
    }

    public user = {
        photo: "images/users/estudante.jpg", 
        name: "Fulano D. Tal", 
        course: "Ciência da Computação", 
        campus: "Nova Iguaçu - IM", 
        certificatesNumber: 32, 
        eventsCreated: 11,
        preferences: this.events
    }

    public mainEvent = this.events[1];

    public eventCategories = {
        1: {
            id: 1,
            name: "Aulas de Basquete"
        },
        2: {
            id: 2,
            name: "Aulas de corrida e Yoga"
        },
        3: {
            id: 3,
            name: "Campeonatos de dança e aulas de Ritmo"
        },
        4: {
            id: 4,
            name: "Campeonatos de Tênis de Mesa"
        },
        5: {
            id: 5,
            name: "Jogos/Aulas de Handebol"
        }
    }

    public async index({view} : HttpContextContract) {
        return view.render('account/LandingPage', { events : this.events, user : this.user, mainEvent : this.mainEvent })
    }

    public async showEvent({view} : HttpContextContract) {
        return view.render('events/EventPage', { events : this.events, user : this.user, mainEvent : this.mainEvent, subscribers : this.subscribers})
    }

    public async showEvents({view} : HttpContextContract) {
        return view.render('events/EventsPage', { events : this.events })
    }

    public async createEvent({view} : HttpContextContract) {
        return view.render('events/CreateEvent', { categories: this.eventCategories })
    }

}
