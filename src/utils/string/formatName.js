

// format strings from "john" or "JoHn" to the standard "John"
const formatName = (name) => {
	if(!name || name.trim() === 0) return '';

	return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};


// export the function
module.exports = formatName;
