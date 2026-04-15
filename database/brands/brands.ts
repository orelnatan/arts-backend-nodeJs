

[
    '{{repeat(10, 10)}}',
    {
      id: '{{integer(100, 999)}}',
      image: "https://picsum.photos/id/{{index()}}/300/300",
      index: '{{index()}}',
      name: '{{company().toUpperCase()}}',
      serial: '{{guid()}}',
      description: '{{lorem(1, "sentences")}}',
      section: '{{random("M", "L", "G", "Z", "X")}}',
    }
]
  

const queryPrefix: string = "INSERT INTO `arts`.`brands` (`id`, `image`, `index`, `name`, `serial`, `description`, `section`) VALUES";
let result: string = "";

this.items.forEach((brand) => {
    result += `${queryPrefix} ('${brand.id}', '${brand.image}', '${brand.index}', '${brand.name}', '${brand.serial}', '${brand.description}', '${brand.section}'); \n` 
})

console.log(result);