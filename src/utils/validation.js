export default {
    length: (curr, needle, options) => {
        console.log(curr);
        console.log(needle);
        console.log(curr <= needle);
        if (options !== "min") {
            if (curr >= needle)
                return false;
        } else {
            if (curr <= needle)
                return false;
        }

        return true;
    },
    similarity: (curr, compared) => {
        console.log(curr != compared);
        if (curr != compared)
            return false;
        return true;
    }
}