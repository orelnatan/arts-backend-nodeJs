
[
  '{{repeat(100, 100)}}',
  {
    id: '{{integer(100, 999)}}{{index()}}',
    image: "https://picsum.photos/id/{{(index() + 11)}}/300/300",
    index: '{{index()}}',
    name: '{{company()}} {{lorem(1, "words")}}',
    rank: '{{integer(10, 99)}}',
    serial: '{{guid()}}',
    description: '{{lorem(1, "sentences")}}',
    brandId: '{{random(982, 976, 603, 911, 281, 334, 436, 879, 896, 522)}}'
  }
]


const queryPrefix: string = "INSERT INTO `arts`.`categories` (`id`, `image`, `index`, `name`, `rank`, `serial`, `description`, `brandId`) VALUES";
let result: string = "";

this.items.forEach((item) => {
    result += `${queryPrefix} ('${item.id}', '${item.image}', '${item.index}', '${item.name}', '${item.rank}', '${item.serial}', '${item.description}', '${item.brandId}'); \n` 
})

console.log(result);