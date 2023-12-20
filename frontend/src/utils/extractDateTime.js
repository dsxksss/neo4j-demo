import { DateTime } from "luxon";

function extractDateTime(beijingTimestamp) {
   return DateTime.fromMillis(parseInt(beijingTimestamp)).toFormat("yyyy-MM-dd HH:mm")
}

export { extractDateTime }