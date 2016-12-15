#!/usr/bin/env bash

set -v

header='--header=Metadata-Flavor: Google'

id=$(wget -qO- "$header" http://metadata.google.internal/computeMetadata/v1/instance/id)
zone=$(wget -qO- "$header" http://metadata.google.internal/computeMetadata/v1/instance/zone)
project_id=$(wget -qO- "$header" http://metadata.google.internal/computeMetadata/v1/project/project-id)

if [ "$id" == '' ]
  then
	echo "Using local metadata"
	printf '{"id":"local","zone":"local-machine","project_id":"church-tools"}\n' > metadata.json
  else
    echo "Running on GCP"
    printf '{"id":"%s","zone":"%s","project_id":"%s"}\n' "$id" "$zone" "$project_id" > metadata.json
fi

