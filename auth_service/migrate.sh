#!/bin/bash

if [[ -z $1 ]]
then 
    echo "usage: migrate <migration name>"
    exit 1 
fi


source .env 

echo "Loaded from .env:"
echo -e "\t$DB_USERNAME\n\t$DB_PASSWORD\n\t$DB_NAME\n\t$DB_PORT\n\t$DB_HOST"

alembic revision --autogenerate -m "$1"
alembic upgrade head