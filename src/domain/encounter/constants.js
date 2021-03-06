import { DEFAULT_CONCEPT_REP } from '../concept/constants';

// TODO continue to build this more out of composite conponents defined in other constants files
// TODO (ie make a DEFAULT_LOCATION_REP to following the pattern we have for DEFAULT_CONCEPT_REP

// The default REST representation to use when fetching an encounter
// TODO this will have to be to modified based on GP when to use form field vs comment
// TODO is there a better way to handle rep of nested group members?
export const DEFAULT_ENCOUNTER_REP = `(id,uuid,encounterDatetime,location:(id,uuid,name),encounterType:(id,uuid,name),` +
  `obs:(id,uuid,value:(id,uuid,display,name:(uuid,name)),concept:${DEFAULT_CONCEPT_REP},obsDatetime,comment,display,` +
  `groupMembers:(id,uuid,value:(id,uuid,display,name:(uuid,name)),concept:${DEFAULT_CONCEPT_REP},obsDatetime,comment,display,` +
  `groupMembers:(id,uuid,value:(id,uuid,display,name:(uuid,name)),concept:${DEFAULT_CONCEPT_REP},obsDatetime,comment,display,groupMembers)))`;

export const DEFAULT_ENCOUNTER_POST_REP = '(id,uuid,encounterDatetime)';  // there is some sort of lazy-loading issue when we try to fetch a full rep on a POST; consumers should not rely on a create or update to return more than this minimal REP

export const DEFAULT_ORDER_REP = '(id,uuid,concept,orderNumber,dateActivated,urgency,display,patient,orderType,action,dateStopped,autoExpireDate)';

