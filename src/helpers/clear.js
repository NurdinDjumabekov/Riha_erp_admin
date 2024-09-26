import { transformActionDate, transformDateTime } from "./transformDate";

export const clearRoute = {
  actionType: "",
  number: 0,
  comment: "",
  agent_guid: "",
  is_active: 0,
  route_sheet_guid: "",
};

export const clearEveryListRoute = {
  actionType: "",
  route_guid: "",
  route_sheet_guid: "",
  point_guid: "",
  start_time: transformDateTime(new Date()),
  end_time: transformDateTime(new Date()),
  comment: "",
  ordering: 0,
  status: 0,
  seller_select: {},
};

export const clearActiveMap = {
  guid: "",
  lat: "",
  lon: "",
  actionType: 0,
  listRoute: [],
};
