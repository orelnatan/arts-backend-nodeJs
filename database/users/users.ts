

[
    '{{repeat(15, 15)}}',
    {
      id: '{{integer(100000, 999999)}}{{index()}}',
      avatar: "",
      index: '{{index()}}',
      name: '{{firstName()}} {{surname()}}',
      password: '{{objectId()}}',
      registered: '{{date(new Date(2010, 0, 1), new Date(), "YYYY-MM-dd")}}',
      description: '{{lorem(1, "sentences")}}',
      email: '{{email()}}',
      phone: '05 {{integer(10000000, 99999999)}}',
      type: "",
      company: '{{company()}}',
      address: '{{state()}}, {{city()}}, {{street()}}, {{integer(100, 10000)}}'
    }
]
  

////////////////////////////////////////////////////////////////////


const avatars = [
  "https://i.ibb.co/93qGSC1/Screen-Shot-2022-11-04-at-16-28-44.png",
  "https://i.ibb.co/4gT1QmP/Screen-Shot-2022-11-04-at-16-28-37.png",
  "https://i.ibb.co/Q8p90bj/Screen-Shot-2022-11-04-at-16-28-30.png",
  "https://i.ibb.co/9V0pWZ6/Screen-Shot-2022-11-04-at-16-28-06.png",
  "https://i.ibb.co/W30LkQc/Screen-Shot-2022-11-04-at-16-28-23.png",
  "https://i.ibb.co/3MxJ7k5/Screen-Shot-2022-11-04-at-16-27-59.png",
  "https://i.ibb.co/3Y610jd/Screen-Shot-2022-11-04-at-16-27-33.png",
  "https://i.ibb.co/wQRzwn4/Screen-Shot-2022-11-04-at-16-27-24.png",
  "https://i.ibb.co/f1FZnpT/Screen-Shot-2022-11-04-at-16-27-16.png",
  "https://i.ibb.co/N6W193b/Screen-Shot-2022-11-04-at-16-26-58.png",
  "https://i.ibb.co/TKgZm56/Screen-Shot-2022-11-04-at-16-27-06.png",
  "https://i.ibb.co/P63QJVt/Screen-Shot-2022-11-04-at-16-26-40.png",
  "https://i.ibb.co/BT4RDwC/Screen-Shot-2022-11-04-at-16-26-49.png",
  "https://i.ibb.co/jk7M9Lv/Screen-Shot-2022-11-04-at-16-26-20.png",
  "https://i.ibb.co/mXnG1mg/Screen-Shot-2022-11-04-at-16-26-30.png",
]

const users = [
  {
    "id": 2743120,
    "avatar": "",
    "index": 0,
    "name": "Alyssa Chaney",
    "password": "636526284ad3cafd95865131",
    "registered": "2019-08-07",
    "description": "Esse officia tempor aliqua nisi adipisicing fugiat Lorem in magna.",
    "email": "alyssachaney@terrasys.com",
    "phone": "05 60650274",
    "type": "",
    "company": "Fangold",
    "address": "West Virginia, Allensworth, Junius Street, 3574"
  },

  ////....
]

users.forEach((user, index) => {
    user.avatar = avatars[index]
})

console.log(JSON.stringify(users));  


////////////////////////////////////////////////////////////////////


const queryPrefix: string = "INSERT INTO `arts`.`users` (`id`, `avatar`, `index`, `name`, `password`, `registered`, `description`, `email`, `phone`,`type`,`company`,`address`) VALUES";
let result: string = "";

this.items.forEach((user) => {
    result += `${queryPrefix} ('${user.id}', '${user.avatar}', '${user.index}', '${user.name}', '${user.password}', '${user.registered}', '${user.description}', '${user.email}', '${user.phone}', '${user.type}', '${user.company}', '${user.address}'); \n` 
})

console.log(result);