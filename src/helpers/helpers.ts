
import { MongoError } from 'mongodb';

export function addMonthsToDate(months: number, date: Date) {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
}

export function mongoError(error: MongoError, controllerName: string) {
    
    try {
        return mongoErrorDictionary[controllerName][error.code];
    } catch (err) {
        return `Error AW639: ${error.message}`;
    }
}

export const mongoErrorDictionary = {
    ["UserSubscriptionController"]: { [11000]: 'You already have subscription, please unsubscribe it first to subscribe new one..'}
};