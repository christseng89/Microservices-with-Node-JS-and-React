### Minikube Installation Notes
minikube start --memory 6144 --disk-size 50GB -p ticketing
minikube addons enable ingress -p ticketing
minikube ip -p ticketing
  192.168.59.105 ***

notepad C:\Windows\System32\drivers\etc\hosts
  192.168.59.105  ticketing.com

kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=sk_test_xxx
  secret/stripe-secret created
  
cd ticketing
skaffold dev
  // ### Wait until ...
  [auth] Connected to MongoDb
  [auth] Listening on port 3000!!!!!!!!
  [tickets] Connected to NATS
  [tickets] Connected to MongoDb
  [tickets] Listening on port 3000!!!!!!!!
  [orders] Connected to NATS
  [orders] Connected to MongoDb
  [orders] Listening on port 3000!!!!!!!!
  [payments] Connected to NATS
  [payments] Connected to MongoDb
  [payments] Listening on port 3000!!!!!!!!

### Browser 
https://ticketing.com

### Postman
= Signup
= New Ticket
= New Order
= New Payment
= New Ticket
= Get Tickets
= Get Orders

### Download draw.io to view diagrams folder's files
https://github.com/jgraph/drawio-desktop/releases/tag/v19.0.3
// draw.io-19.0.3-windows-installer.exe