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
        },
        2: {
            id: 2,
            name: "Dança",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu scelerisque felis imperdiet proin fermentum leo vel. Ultrices tincidunt arcu non sodales neque. Risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit. Purus sit amet volutpat consequat mauris. Commodo ullamcorper a lacus vestibulum sed arcu non odio. A iaculis at erat pellentesque adipiscing commodo elit.",
            photo: "images/events/evento-danca.jpg",
        },
        3: {
            id: 3,
            name: "Esportes",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu scelerisque felis imperdiet proin fermentum leo vel. Ultrices tincidunt arcu non sodales neque. Risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit. Purus sit amet volutpat consequat mauris. Commodo ullamcorper a lacus vestibulum sed arcu non odio. A iaculis at erat pellentesque adipiscing commodo elit.",
            photo: "images/events/evento-esporte.jpg",
        }
    }

    public async index({auth, view} : HttpContextContract) {
        //landing page (homepage)
        var userId = auth.user!.id;
        var interests: any[] = []
        var nullPhoto = 'https://liversity-app.s3.amazonaws.com/students/photo/default-profile.jpg'

        var eventsCreatedNumber = await Database
        .from('event_organizers')
        .whereRaw('user_id = ?', [userId])
        .count('event_id')
        .firstOrFail()
        eventsCreatedNumber = eventsCreatedNumber['count'];

        interests = await Database
        .from('interests')
        .join('categories', (query) => {
        query.on('interests.category_id', '=', 'categories.id')
        })
        .whereRaw('interests.user_id = ?', [auth.user!.id])
        .select('categories.id')
        .select('categories.name')

        if(auth.user!.campusId) {
            var userCampus = await Campus.findByOrFail('id', auth.user!.campusId)
            if(userCampus) {
                var userCampusName = userCampus?.$attributes.name
            }
        }

        if(auth.user!.profileId == 2) {
            //if user is a student
            var events: any[] = []
            var firstEvent: any = {}
            var nextEvents: any[] = []
            var participantsAmount = 0
            var eventOrganizer = ''

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
                var certificatesNumber = await Database
                .from('event_subscriptions')
                .whereRaw('student_id = ?', [student.id])
                .andWhereRaw('attendance = ?', [true])
                .count('attendance')
                .firstOrFail()
                certificatesNumber = certificatesNumber['count'];

                events = await Database
                .from('event_subscriptions')
                .join('events', (query) => {
                query.on('event_subscriptions.event_id', '=', 'events.id')
                })
                .whereRaw('event_subscriptions.student_id = ?', [student.id])
                .select('events.*')
                .select('event_subscriptions.id as event_subscriptions.id')
                .limit(4)
                
                if(events.length > 0) {
                    firstEvent = events[0]
                    if(events.length > 1) 
                        nextEvents = events.slice(1)
        
                    participantsAmount = await Database
                    .from('event_subscriptions')
                    .whereRaw('event_id = ?', [firstEvent.id])
                    .count('student_id')
                    .firstOrFail()
                    participantsAmount = participantsAmount['count'];

                    eventOrganizer = await Database
                    .from('users')
                    .join('event_organizers', (query) => {
                    query.on('users.id', '=', 'event_organizers.user_id')
                    })
                    .whereRaw('event_organizers.event_id = ?', [firstEvent.id])
                    .select('users.name')
                    .firstOrFail()
                    eventOrganizer = eventOrganizer['name'];
                }
            }
            return view.render('account/landingPage', {
                    user: auth.user!.$attributes,
                    nullPhoto : nullPhoto, student : student, userCampusName : userCampusName, 
                    events : events, firstEvent : firstEvent, nextEvents : nextEvents, interests: interests,
                    numberCertificates : certificatesNumber, numberEventsCreated : eventsCreatedNumber,
                    numberParticipants: participantsAmount, organizer: eventOrganizer })
        }
        else {
            //if user is an admin
            return view.render('account/landingPage', { user: auth.user!.$attributes, userCampusName : userCampusName, nullPhoto : nullPhoto, interests: interests, numberEventsCreated : eventsCreatedNumber })
        }
    }

    public async createEventView({ auth, view} : HttpContextContract) {
        var categories = await Category.query().orderBy('id', 'asc')
        var campuses = await Campus.query().orderBy('name', 'asc')
        return view.render('events/createEvent', { completedProfile: auth.user!.completedProfile, categories: categories, campuses: campuses})
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

        var dateNow = new Date()
        if(new Date(newEvent.eventDate) < dateNow) {
            session.flashExcept(['createEvent'])
            session.flash({ errors: { createEvent: 'A data do evento deve ser maior ou igual à data de hoje' } })
            return response.redirect().toRoute('createEvent.view')
        }

        if(newEvent.eventDate < newEvent.limitSubscriptionDate) {
            session.flashExcept(['createEvent'])
            session.flash({ errors: { createEvent: 'A data limite para inscrições deve ser inferior ou igual à data do evento' } })
            return response.redirect().toRoute('createEvent.view')
        }

        try {
            var event = await Event.create({ name: newEvent.name, eventDate: newEvent.eventDate, initialSubscriptionDate: new Date(), 
                limitSubscriptionDate: newEvent.limitSubscriptionDate, description: newEvent.description, categoryId: newEvent.category, 
                local: newEvent.local, campusId: newEvent.campus, linkCommunicationGroup: newEvent.linkCommunicationGroup, 
                photo: newEvent.photo, document: newEvent.document, statusId: 2 });

            await EventOrganizer.create({ userId: auth.user!.id, eventId: event.id} )
            session.flashExcept(['createEvent'])
            session.flash({ success: { createEvent: 'Evento cadastrado com sucesso! Aguarde a avaliação dos administradores em relação à atividade.' } })
            response.redirect().toRoute('createEvent.view')

        } catch {
            session.flashExcept(['createEvent'])
            session.flash({ errors: { createEvent: 'Não foi possível realizar o cadastro do evento' } })

            return response.redirect().toRoute('createEvent.view')
        }
    }

    public async eventPageView({ auth, params, view }: HttpContextContract) {
        var dateNow = new Date()
        const event = await Event.find(params.id)
        var subscribers: any[] = []
        var subscribersNumber = await Database
            .from('event_subscriptions')
            .whereRaw('event_id = ?', [params.id])
            .count('student_id')
            .firstOrFail()
        subscribersNumber = subscribersNumber['count'];

        if(subscribersNumber > 0) {
            subscribers =  await Database
            .from('event_subscriptions')
            .join('students', (query) => {
                query.on('event_subscriptions.student_id', '=', 'students.id')
            })
            .join('users', (query) => {
                query.on('students.user_id', '=', 'users.id')
            })
            .whereRaw('event_id = ?', [params.id])
            .select('users.photo')
            .limit(5)
        }  

        var eventCampus = await Campus.findByOrFail('id', event!.campusId)
        if(eventCampus) {
            var campusName = eventCampus?.$attributes.name
        }

        var eventOrganizer = await Database
            .from('users')
            .join('event_organizers', (query) => {
            query.on('users.id', '=', 'event_organizers.user_id')
            })
            .whereRaw('event_organizers.event_id = ?', [event!.id])
            .select('users.name')
            .firstOrFail()
            eventOrganizer = eventOrganizer['name'];

        return view.render('events/eventPage', { event : event, dateNow : dateNow, events : this.events, 
                                                subscribersNumber: subscribersNumber, subscribers: subscribers, campusName: campusName, 
                                                eventOrganizer: eventOrganizer, completedProfile: auth.user!.completedProfile, profileId: auth.user!.profileId})
    }

    public async showEvents({view} : HttpContextContract) {
        var events = await Database
        .from('events')
        .whereRaw('status_id = ?', [1]) //mural terá apenas eventos aprovados
        .select('events.*')
        .orderBy('created_at', 'desc')

        var campuses = await Database
        .from('campuses')
        .select('campuses.*')

        var categories = await Database
        .from('categories')
        .select('categories.*')

        if(events.length > 0) {
            for(var event of events) {
                var subscribersNumber = await Database
                .from('event_subscriptions')
                .whereRaw('event_id = ?', [event.id])
                .count('student_id')
                .firstOrFail()
                event.subscribersNumber = subscribersNumber['count']; 
            }
        }
        
        var dateNow = new Date()
        var activeEvents = events.filter(function(event) {
            return new Date(event.limit_subscription_date) > dateNow
        })

        var inactiveEvents = events.filter(function(event) {
            return new Date(event.limit_subscription_date) <= dateNow
        })

        return view.render('events/eventsPage', { events: events, activeEvents : activeEvents, inactiveEvents : inactiveEvents, campuses : campuses, categories : categories })
    }

    public async filterEvents({request, view} : HttpContextContract) {
        const newFilters = request.all()
        var dateNow = new Date()
        var events: any[] = []

        if(newFilters.campuses === "Inscrições encerrando em breve"){
            events = await Database
            .from('events')
            .join('campuses', (query) => {
                query.on('events.campus_id', '=', 'campuses.id')
                })
            .join('categories', (query) => {
                query.on('events.category_id', '=', 'categories.id')
                })
            .whereRaw('status_id = ?', [1]) //mural terá apenas eventos aprovados
            .andWhereRaw('limit_subsciption_date > ?', [dateNow])
            .select('events.*')
            .select('campuses.name AS campus_name')
            .select('categories.name AS category_name') 
            .orderBy('limit_subsciption_date', 'desc')
        }
        else if(newFilters.campuses === "Acontecerão em breve"){
            events = await Database
            .from('events')
            .join('campuses', (query) => {
                query.on('events.campus_id', '=', 'campuses.id')
                })
            .join('categories', (query) => {
                query.on('events.category_id', '=', 'categories.id')
                })
            .whereRaw('status_id = ?', [1]) //mural terá apenas eventos aprovados
            .andWhereRaw('event_date > ?', [dateNow])
            .select('events.*')
            .select('campuses.name AS campus_name')
            .select('categories.name AS category_name') 
            .orderBy('event_date', 'desc')
        }
        else {
            events = await Database
            .from('events')
            .join('campuses', (query) => {
                query.on('events.campus_id', '=', 'campuses.id')
                })
            .join('categories', (query) => {
                query.on('events.category_id', '=', 'categories.id')
                })
            .whereRaw('status_id = ?', [1]) //mural terá apenas eventos aprovados
            .select('events.*')
            .select('campuses.name AS campus_name')
            .select('categories.name AS category_name')  
            .orderBy('event_date', 'desc')
        }


        var campuses = await Database
        .from('campuses')
        .select('campuses.*')

        var categories = await Database
        .from('categories')
        .select('categories.*')

        if(events.length > 0) {
            for(var event of events) {
                var subscribersNumber = await Database
                .from('event_subscriptions')
                .whereRaw('event_id = ?', [event.id])
                .count('student_id')
                .firstOrFail()
                event.subscribersNumber = subscribersNumber['count']; 
            }
        }

        if(newFilters.campuses != "Todos")
            events = events.filter(function(event) {
                console.log(event)
                return event.campus_name === newFilters.campuses
            })

        if(newFilters.categories != "Todos")
            events = events.filter(function(event) {
                return event.category_name === newFilters.categories
            })

        if(newFilters.status === "Inscrições Abertas")
            events = events.filter(function(event) {
                return new Date(event.limit_subscription_date) > dateNow
            })

        else if(newFilters.status === "Inscrições Fechadas")
            events = events.filter(function(event) {
                return new Date(event.limit_subscription_date) <= dateNow
            })

        return view.render('events/eventsPage', { events: events, campuses : campuses, categories : categories })
    }

    public async searchEvents(request, {view} : HttpContextContract) {
        const newSearch = request.all()

        var events = Database
            .raw(
                'select * from events order by similarity (name, ?)', [newSearch.search]
            )
            .wrap('(', ')')

            Database
            .from('events')
            .orderBy(events, 'desc')

        return view.render('events/eventsPage', { events: events })
    }

    public async userEvents({ auth, response, view } : HttpContextContract) {
        var events = await Database
        .from('events')
        .join('event_organizers', (query) => {
            query.on('events.id', '=', 'event_organizers.event_id')
        })
        .whereRaw('event_organizers.user_id = ?', [auth.user!.id])
        .select('*')
        .orderBy('event_date', 'desc')

        return view.render('events/userEvents', { events: events})
    }

    public async updateEventView({ auth, view, params} : HttpContextContract ) {
        var categories = await Category.query().orderBy('id', 'asc')
        var campuses = await Campus.query().orderBy('name', 'asc')
        
        var event = await Event.findBy('id', params.id)
        var eventDateFormatted = ''
        if(event!.eventDate != null) {
            const offset = event!.eventDate.getTimezoneOffset()
            var eventDate = new Date(event!.eventDate.getTime() - (offset*60*1000))
            eventDateFormatted = eventDate.toISOString().split('T')[0]
        }
        var eventLimitSubsDateFormatted = ''
        if(event!.limitSubscriptionDate != null) {
            const offset = event!.limitSubscriptionDate.getTimezoneOffset()
            var eventLimitSubsDate = new Date(event!.limitSubscriptionDate.getTime() - (offset*60*1000))
            eventLimitSubsDateFormatted = eventLimitSubsDate.toISOString().split('T')[0]
        }

        return view.render('events/editEvent', { event: event, eventDate: eventDateFormatted, eventLimitSubsDate: eventLimitSubsDateFormatted,
                                                categories: categories, campuses: campuses })
    }

    public async updateEvent({request, session, response, params} : HttpContextContract) {
        console.log(params)
        const updEvent = request.all()
        console.log(updEvent)

        if(!updEvent.name || !updEvent.eventDate || !updEvent.limitSubscriptionDate || 
            !updEvent.description || !updEvent.local || !updEvent.campus || !updEvent.linkCommunicationGroup ||
            !updEvent.photo || !updEvent.document) {
            session.flashExcept(['updateEvent'])
            session.flash({ errors: { updateEvent: 'Preencha todos os campos solicitados' } })
            return response.redirect().toRoute('updateEvent.view', {id: params.id})
        }

        var dateNow = new Date()
        if(new Date(updEvent.eventDate) < dateNow) {
            session.flashExcept(['updateEvent'])
            session.flash({ errors: { updateEvent: 'A data do evento deve ser maior ou igual à data de hoje' } })
            return response.redirect().toRoute('updateEvent.view', {id: params.id})
        }

        if(updEvent.eventDate < updEvent.limitSubscriptionDate) {
            session.flashExcept(['updateEvent'])
            session.flash({ errors: { updateEvent: 'A data limite para inscrições deve ser inferior ou igual à data do evento' } })
            return response.redirect().toRoute('updateEvent.view', {id: params.id})
        }

        try {
            !updEvent.name || !updEvent.eventDate || !updEvent.limitSubscriptionDate || 
            !updEvent.description || !updEvent.local || !updEvent.campus || !updEvent.linkCommunicationGroup ||
            !updEvent.photo || !updEvent.document
            var event = await Event.findBy('id', params.id)
            if(event) {
                event.name = updEvent.name
                event.eventDate = updEvent.eventDate
                event.limitSubscriptionDate = updEvent.limitSubscriptionDate
                event.description = updEvent.description
                event.local = updEvent.local
                event.campusId = updEvent.campus
                event.linkCommunicationGroup = updEvent.linkCommunicationGroup
                event.photo = updEvent.photo
                await event.save()
            }

            session.flashExcept(['updateEvent'])
            session.flash({ success: { updateEvent: 'Evento atualizado com sucesso!' } })
            response.redirect().toRoute('updateEvent.view', {id: params.id})

        } catch {
            session.flashExcept(['updateEvent'])
            session.flash({ errors: { updateEvent: 'Não foi possível atualizar as informações do evento' } })

            return response.redirect().toRoute('updateEvent.view', {id: params.id})
        }
    }

    public async deleteEvent({auth, response, session, params} : HttpContextContract) {
        var event = await Event.findBy('id', params.id)
        if(event) {
            var eventOrganizer = await EventOrganizer.findBy('eventId', event.id);
            if(eventOrganizer!.userId == auth.user!.id) {
                try{
                    await event.delete()
                    session.flashExcept(['deleteEvent'])
                    session.flash({ success: { deleteEvent: 'Evento excluído com sucesso!.' } })
                    response.redirect().toRoute('userEvents.view')
                }
                catch {
                    session.flashExcept(['deleteEvent'])
                    session.flash({ errors: { deleteEvent: 'Não foi possível realizar a exclusão do evento' } })

                    return response.redirect().toRoute('userEvents.view')
                }
            }
        }
    }

    public async eventPageParticipantsView ({params, view} : HttpContextContract ){
            var subscribers: any[] = []
            var subscribersNumber = await Database
                .from('event_subscriptions')
                .whereRaw('event_id = ?', [params.id])
                .count('student_id')
                .firstOrFail()
            subscribersNumber = subscribersNumber['count'];

            if(subscribersNumber > 0) {
                subscribers =  await Database
                .from('event_subscriptions')
                .join('students', (query) => {
                    query.on('event_subscriptions.student_id', '=', 'students.id')
                })
                .join('users', (query) => {
                    query.on('students.user_id', '=', 'users.id')
                })
                .whereRaw('event_id = ?', [params.id])
                .select('users.photo')
                .select('users.name')
                .select('students.course')
                .select('users.campus_id')
                .select('users.completed_profile')
            }

        return view.render('events/eventParticipant', { subscribersNumber: subscribersNumber, subscribers: subscribers })
    }

    public async manageEventParticipantsView ({params, view} : HttpContextContract ){
        var subscribers: any[] = []
        var subscribersNumber = await Database
            .from('event_subscriptions')
            .whereRaw('event_id = ?', [params.id])
            .count('student_id')
            .firstOrFail()
        subscribersNumber = subscribersNumber['count'];

        if(subscribersNumber > 0) {
            subscribers =  await Database
            .from('event_subscriptions')
            .join('students', (query) => {
                query.on('event_subscriptions.student_id', '=', 'students.id')
            })
            .join('users', (query) => {
                query.on('students.user_id', '=', 'users.id')
            })
            .whereRaw('event_id = ?', [params.id])
            .select('users.photo')
            .select('users.name')
            .select('students.course')
            .select('students.number_enrollment')
            .select('users.campus_id')
            .select('users.completed_profile')
        }

        return view.render('events/manageEventParticipants', { subscribersNumber: subscribersNumber, subscribers: subscribers })
    }

    public async evaluateEventsView({ auth, params, view }: HttpContextContract) {
        if(auth.user!.profileId == 1) {
            var events = await Database
            .from('events')
            .whereRaw('status_id = ?', [2]) //get only pending events
            .select('events.*')
            .orderBy('event_date', 'asc')

            return view.render('events/evaluateEvents', {completedProfile : auth.user!.completedProfile, events: events})
        }
        else {
            return view.render('errors/unauthorized')
        }
    }

    public async evaluateEvents({ auth, session, response, params }: HttpContextContract) {
        if(auth.user!.profileId != 1) {
            session.flashExcept(['evaluateEvent'])
            session.flash({ errors: { evaluateEvent: 'Não foi possível avaliar o evento.' } })
            return response.redirect().toRoute('EventsController.evaluateEventsView')
        }

        var event = await Event.findBy('id', params.eventId)
        event!.statusId = params.statusId
        await event!.save()
        
        session.flashExcept(['evaluateEvent'])
        session.flashExcept(['statusId'])
        session.flash({ success: { evaluateEvent: 'Status de evento atualizado com sucesso!', statusId: params.statusId } })
        return response.redirect().toRoute('EventsController.evaluateEventsView')
    }
}
