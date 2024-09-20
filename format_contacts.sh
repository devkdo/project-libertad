#!/bin/bash

# Check if an input file is provided as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 inputfile"
  exit 1
fi

inputfile="$1"
filename="${inputfile%.*}"
extension="${inputfile##*.}"
outputfile="${filename}_formatted.${extension}"

# Read the input file line by line and write to the output file
while IFS= read -r line; do
  # Use regex to find emails and format them
  formatted_line=$(echo "$line" | sed -E 's/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/<\1>,/g')
  echo "$formatted_line" >> "$outputfile"
done < "$inputfile"
