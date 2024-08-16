# be sure to source .env first!

curl --request GET \
  --url http://localhost:10430/messages \
  --header "Authorization: Bearer $PGRST_TOKEN" \
  --header 'Content-Type: application/json'

curl --request POST \
  --url http://localhost:10430/messages \
  --header "Authorization: Bearer $PGRST_TOKEN" \
  --header 'Content-Type: application/json' \
  --data '{
	"msg": "OH YEEEEAAAAH!",
	"username": "Foo",
	"room": "javascript",
	"created": "2024-08-16T18:38:23+00"
}'
