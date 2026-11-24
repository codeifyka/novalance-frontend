import type { AxiosResponse } from "axios";
import Result from "./Result";
import moment from "moment";

export default class Utils {
    static handleResponse<Error, Type>(response: AxiosResponse<any, any>) {
        if (response.data.error) {
            return Result.failure<Error, Type>(response.data.error);
        } else {
            return Result.success<Error, Type>(response.data.data);
        }
    }

    static handleResponseWithErrors<Error, Type>(response: AxiosResponse<any, any>) {
        if (response.data.error) {
            return Result.failure<Error, Type>(response.data.data);
        } else {
            return Result.success<Error, Type>(response.data.data);
        }
    }

    /**
     * Standard date-time format: 'DD MMM YYYY · HH:mm'
     */
    static formatDateTime(date?: string | Date | null): string {
        if (!date) return '';
        const m = moment.utc(date);
        return m.isValid() ? m.format('DD MMM YYYY · HH:mm') : String(date);
    }

    /**
     * Standard date-only format: 'DD MMM YYYY'
     */
    static formatDate(date?: string | Date | null): string {
        if (!date) return '';
        const m = moment.utc(date);
        return m.isValid() ? m.format('DD MMM YYYY') : String(date);
    }

    /**
     * Standard time-only format: 'HH:mm'
     */
    static formatTime(date?: string | Date | null): string {
        if (!date) return '';
        const m = moment.utc(date);
        return m.isValid() ? m.format('HH:mm') : '';
    }

    /**
     * Returns [day, time] tuple cleanly parsed via moment
     */
    static splitDateTime(date?: string | Date | null): [string, string] {
        if (!date) return ['', ''];
        const m = moment.utc(date);
        if (!m.isValid()) return [String(date), ''];
        return [
            m.format('DD MMM YYYY'),
            m.format('HH:mm'),
        ];
    }
}