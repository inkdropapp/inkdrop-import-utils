/* Return size, in bytes, of the given UTF-8 string.
 * @param [String] string
 * @return [Number] size of the string in bytes
 */
function getBinarySize(string) {
  return Buffer.byteLength(string || '', 'utf8')
}

/*
 * Get a copy of the given UTF-8 string truncated to a max *binary* size.
 * Avoid truncating in the middle of an UTF-8 char.
 * If truncated, the returned string will have a trailing "...",
 * still respecting the max binary size.
 *
 * Note : desired binary size must be at last 3.
 * Note : the returned string size may be smaller than desired size due to UTF-8 wide chars.
 *
 * @param [String] string
 * @param [Number] binaryMaxSize - the max size we should enforce
 * @param [function()] truncateCallback - if provided, function to be called when a truncating occur.
 *                   Useful for ex. displaying a warning.
 */
function truncateToBinarySize(string, binaryMaxSize, truncateCallback) {
  string = string || ''
  if (getBinarySize(string) <= binaryMaxSize) return string // OK

  // we'll use buffer.write to truncate,
  // since it doesn't overflow neither write partial UTF-8 characters.
  var truncatingBuffer = new Buffer(
    binaryMaxSize - DEFAULT_TRUNCATE_STRING_BINARY_SIZE
  )
  var writtenBinaryLength = truncatingBuffer.write(string, 'utf8')
  var truncatedString =
    truncatingBuffer.toString('utf8', 0, writtenBinaryLength) +
    DEFAULT_TRUNCATE_STRING

  if (truncateCallback) truncateCallback(binaryMaxSize, string, truncatedString)

  return truncatedString
}

module.exports = truncateToBinarySize
