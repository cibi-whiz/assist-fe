import moment from "moment";
const filters = {
    from_date: moment().subtract(6, "days").format("YYYY-MM-DD"),
    to_date: moment().format("YYYY-MM-DD"),
    email: "",
    country: null,
    customer: false,
    sent: "",
    sent_by: null,
  };
  export default filters;