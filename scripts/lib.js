function startsWith(str, substr) {
    return substr.length > 0 && substring(str, 0, substr.length) === substr;
}

function charAt(string, index) {
    var first = string.charCodeAt(index);
    var second;
    if (first >= 0xD800 && first <= 0xDBFF && string.length > index + 1) {
        second = string.charCodeAt(index + 1);
        if (second >= 0xDC00 && second <= 0xDFFF) {
            return string.substring(index, index + 2);
        }
    }
    return string[index];
}

function slice(string, start, end) {
    var accumulator = "";
    var character;
    var stringIndex = 0;
    var unicodeIndex = 0;
    var length = string.length;

    while (stringIndex < length) {
        character = charAt(string, stringIndex);
        if (unicodeIndex >= start && unicodeIndex < end) {
            accumulator += character;
        }
        stringIndex += character.length;
        unicodeIndex += 1;
    }
    return accumulator;
}

function toNumber(value, fallback) {
    if (value === undefined) {
        return fallback;
    } else {
        return Number(value);
    }
}

function substring(string, start, end) {
    var realStart = toNumber(start, 0);
    var realEnd = toNumber(end, string.length);
    if (realEnd == realStart) {
        return "";
    } else if (realEnd > realStart) {
        return slice(string, realStart, realEnd);
    } else {
        return slice(string, realEnd, realStart);
    }
}

//--------------------

function getSession() {
    var session = get("session")
    if (!session) {
        //create new session
        var session = { step: 0 }
        if (callback) {
            session.id = callback.From.ID;
            session.name = callback.From.FirstName ? callback.From.FirstName : callback.From.Username;
        } else {
            session.id = message.Chat.ID;
            session.name = message.From.FirstName ? message.From.FirstName : message.From.Username;
        }
        set("session", session)
    }
    return session
}

function updateOptions(options) {
    replaceOptions(message.Chat.ID, message.MessageID, options)
}

function proceed() {
    var session = getSession()
    session.step++
    set("session", session)
}

function bye(message, attachment) {
    send(message, null, attachment)
    del("session")
}