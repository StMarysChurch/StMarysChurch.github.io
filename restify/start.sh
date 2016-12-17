#!/usr/bin/env sh

alias yarn-exec='PATH=$(yarn bin):$PATH'

header='--header=Metadata-Flavor: Google'

id=$(wget -qO- "$header" http://metadata.google.internal/computeMetadata/v1/instance/id)
zone=$(wget -qO- "$header" http://metadata.google.internal/computeMetadata/v1/instance/zone)
project_id=$(wget -qO- "$header" http://metadata.google.internal/computeMetadata/v1/project/project-id)
last_git_commit_sha=$(git log -1 --format="%h") #use H for full git sha

if [ "$id" = "" ]
  then
	echo "Using local metadata"
	printf '{"id":"local_instance","zone":"local","project_id":"church-tools","sha":"%s"}\n' "$last_git_commit_sha"> metadata.json
  else
    echo "Running on GCP"
    printf '{"id":"%s","zone":"%s","project_id":"%s","sha":"%s"}\n' "$id" "$zone" "$project_id" "$last_git_commit_sha"> metadata.json
fi

#yarn run start