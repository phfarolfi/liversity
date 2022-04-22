import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Event from 'App/Models/Event'
import Database from '@ioc:Adonis/Lucid/Database'
import Student from 'App/Models/Student'
import EventOrganizer from 'App/Models/EventOrganizer'
import Campus from 'App/Models/Campus'
import Category from 'App/Models/Category'

export default class EventsController {
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

    public async index({auth, view} : HttpContextContract) {
        //landing page (homepage)
        var userId = auth.user!.id;
        var events: any[] = []
        var firstEvent: any = {}
        var nextEvents: any[] = []
        var interests: any[] = []
        var participantsAmount = 0
        var eventOrganizer = ''
        var nullPhoto = 'https://liversity-app.s3.amazonaws.com/students/photo/default-profile.jpg'

        var student = await Database
        .from('students')
        .join('users', (query) => {
          query.on('students.user_id', '=', 'users.id')
        })
        .whereRaw('users.id = ?', [userId])
        .select('students.*')
        .select('users.name')
        .firstOrFail()

        if(student) {
            if(student.campus_id) {
                var studentCampus = await Campus.findByOrFail('id', student.campus_id)
                if(studentCampus) {
                    var studentCampusName = studentCampus?.$attributes.name
                }
            }

            var certificatesNumber = await Database
            .from('event_subscriptions')
            .whereRaw('student_id = ?', [student.id])
            .andWhereRaw('presenca = ?', ['PRESENTE'])
            .count('presenca')
            .firstOrFail()
            certificatesNumber = certificatesNumber['count(`presenca`)'];

            var eventsCreatedNumber = await Database
            .from('event_organizers')
            .whereRaw('user_id = ?', [userId])
            .count('event_id')
            .firstOrFail()
            eventsCreatedNumber = eventsCreatedNumber['count(`event_id`)'];

            interests = await Database
            .from('interests')
            .join('categories', (query) => {
              query.on('interests.category_id', '=', 'categories.id')
            })
            .whereRaw('interests.student_id = ?', [student!.id])
            .select('categories.id')
            .select('categories.name')

            events = await Database
            .from('event_subscriptions')
            .join('events', (query) => {
              query.on('event_subscriptions.event_id', '=', 'events.id')
            })
            .whereRaw('event_subscriptions.student_id = ?', [student.id])
            .select('events.*')
            .select('event_subscriptions.id')
            .limit(4)

            if(events.length > 0) {
                firstEvent = events[0]
                if(events.length > 1) 
                    nextEvents = events.slice(1)
    
                participantsAmount = await Database
                .from('event_subscriptions')
                .whereRaw('event_id = ?', [firstEvent.event_id])
                .count('student_id')
                .firstOrFail()

                eventOrganizer = await Database
                .from('users')
                .join('event_organizers', (query) => {
                  query.on('users.id', '=', 'event_organizers.user_id')
                })
                .whereRaw('event_organizers.event_id = ?', [firstEvent.event_id])
                .select('users.name')
                .firstOrFail()
            }
        }
        return view.render('account/landingPage', { 
                nullPhoto : nullPhoto, student : student, studentCampus : studentCampusName, 
                events : events, firstEvent : firstEvent, nextEvents : nextEvents, interests: interests,
                numberCertificates : certificatesNumber, numberEventsCreated : eventsCreatedNumber,
                numberParticipants: participantsAmount, organizer: eventOrganizer })
    }

    public async createEventView({ view } : HttpContextContract) {
        var categories = await Category.query().orderBy('id', 'asc')
        var campuses = await Campus.query().orderBy('name', 'asc')
        return view.render('events/createEvent', { categories: categories, campuses: campuses})
    }

    public async createEvent({auth, request, response, session} : HttpContextContract) {
        const newEvent = request.all()

        if(!newEvent.name || !newEvent.eventDate || !newEvent.limitSubscriptionDate || !newEvent.category ||
            !newEvent.description || !newEvent.local || !newEvent.campus || !newEvent.linkCommunicationGroup ||
            !newEvent.photo || !newEvent.document) {
            session.flashExcept(['createEvent'])
            session.flash({ errors: { createEvent: 'Preencha todos os campos solicitados' } })
            return response.redirect().toRoute('createEvent.view')
        }

        
        try {
            // var dateNow = new Date().toISOString().split('T')[0];
            var event = await Event.create({ name: newEvent.name, eventDate: newEvent.eventDate, initialSubscriptionDate: new Date(), 
                limitSubscriptionDate: newEvent.limitSubscriptionDate, description: newEvent.description, categoryId: newEvent.category, 
                local: newEvent.local, campusId: newEvent.campus, linkCommunicationGroup: newEvent.linkCommunicationGroup, 
                photo: newEvent.photo, document: newEvent.document, statusId: 2 });

            await EventOrganizer.create({ userId: auth.user!.id, eventId: event.id} )
            response.redirect().toRoute('eventPage.view')
        } catch {
            session.flashExcept(['createEvent'])
            session.flash({ errors: { createEvent: 'Não foi possível realizar o cadastro do evento' } })

            return response.redirect().toRoute('createEvent.view')
        }
    }

    public async eventPageView({ params, view }: HttpContextContract) {
        // const evento = await Event.find(params.id)
        return view.render('events/eventPage', { events : this.events, mainEvent : this.mainEvent, subscribers : this.subscribers})
    }

    public async showEvents({view} : HttpContextContract) {
        var events = await Database
        .from('events')
        // .whereRaw('status_id = ?', [1]) //descomentar para quando tiver funcionando a parte de alterar o evento para aprovado/reprovado
        .select('events.*')

        if(events.length > 0) {
            for(var event of events) {
                var subscribersNumber = await Database
                .from('event_subscriptions')
                .whereRaw('event_id = ?', [event.id])
                .count('student_id')
                .firstOrFail()
                event.subscribersNumber = subscribersNumber['count(`student_id`)']; 
            }
        }
        
        var dateNow = new Date()
        var activeEvents = events.filter(function(event) {
            return new Date(event.limit_subscription_date) > dateNow
        })

        var inactiveEvents = events.filter(function(event) {
            return new Date(event.limit_subscription_date) <= dateNow
        })

        return view.render('events/eventsPage', { events: events, activeEvents : activeEvents, inactiveEvents : inactiveEvents })
    }

    // Página de participantes 

    public async eventPageParticipantsView ({view} : HttpContextContract ){
        
        var participantes = {
            1: {
                id: 1,
                foto: "https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png",
                name: "Usuario 1"
            },
            2: {
                id: 2,
                foto: "https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png",
                name: "Usuario 2"
            },
            3: {
                id: 3,
                foto: "https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png",
                name: "Usuario 3"
            },
            4: {
                id: 4,
                foto: "https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png",
                name: "Usuario 4"
            },
            5: {
                id: 5,
                foto: "https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png",
                name: "Usuario 5"
            }
        }

        return view.render('events/eventParticipant', {participantes:participantes})
        
    }
}
