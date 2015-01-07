# Example usage

## start a dat server

```
dat-server listen
```

## start a dat server with custom path

```
dat-server listen --path=/var/www/path/to/my/dat
```

## then you can poke around at the REST API:

```
/api/changes
/api/changes?data=true
/api/metadata
/api/rows/:docid
POST /api/bulk content-type: application/json (newline separated json)
```
