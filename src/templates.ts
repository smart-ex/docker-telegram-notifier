import {TEvent} from './app'

export default (event: TEvent) => {
  const key = `${event.Type}_${event.Action}`
  switch (key) {
    case  'container_start':
      return (event: TEvent) =>
        `Started <b>${event.Actor.Attributes.name} (${event.Actor.Attributes.image}) {${event.Actor.ID.substr(0, 12)}}</b>`
    
    case 'container_die':
      return (event: TEvent) =>
        `Stopped <b>${event.Actor.Attributes.name} (${event.Actor.Attributes.image}) {${event.Actor.ID.substr(0, 12)}}</b>\nExit Code: <b>${event.Actor.Attributes.exitCode}</b>`
    
    case 'container_health_status: healthy':
      return (event: TEvent) =>
        `Status <b>Healthy</b> for <b>${event.Actor.Attributes.name} (${event.Actor.Attributes.image}) {${event.Actor.ID.substr(0, 12)}}</b>`
    
    case 'container_health_status: unhealthy':
      return (event: TEvent) =>
        `Status <b>Unhealthy</b> for <b>${event.Actor.Attributes.name} (${event.Actor.Attributes.image}) {${event.Actor.ID.substr(0, 12)}}</b>`
    default:
      return null
  }
}
