FROM python:3.8.6-alpine

WORKDIR /home
RUN apk update && \
    apk add --no-cache postgresql-libs
RUN apk add --no-cache --virtual .build-deps build-base libffi-dev libressl-dev postgresql-dev
RUN pip install poetry
COPY ./poetry.lock ./pyproject.toml ./
RUN poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi
RUN apk --purge del .build-deps
COPY . .

CMD ["gunicorn", "watchdog_be.wsgi", "-b", "0.0.0.0:8000"]
