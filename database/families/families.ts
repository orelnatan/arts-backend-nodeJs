

[
    '{{repeat(300, 300)}}',
    {
      id: '{{integer(1000, 9999)}}{{index()}}',
      image: "https://picsum.photos/id/{{(index() + 111)}}/300/300",
      index: '{{index()}}',
      name: '{{company()}} {{lorem(2, "words")}}',
      serial: '{{guid()}}',
      symbol: '{{random("MS", "LD", "GF", "ZS", "XR", "RR", "QL", "ME", "PO", "XH", "SD")}}',
      description: '{{lorem(1, "sentences")}}',
      categoryId: '{{random(1790, 6681, 5532, 5563, 9924, 8055, 6616, 3937, 7818, 3009, 99310, 78011, 68712, 92713, 87114, 75515, 80916, 34017, 71018, 58319, 94220, 13821, 25522, 39923, 21324, 79325, 75326, 72027, 18728, 96929, 25530, 99131, 63032, 35933, 56134, 66635, 24236, 65937, 46738, 20739, 96040, 29341, 72842, 39643, 14944, 91145, 19946, 10947, 65048, 52449, 10450, 46151, 11352, 22653, 49054, 86755, 25356, 43657, 22558, 26659, 25860, 37861, 49962, 22663, 90564, 96865, 98366, 28667, 59568, 49369, 32170, 64071, 13772, 29973, 57474, 54875, 84776, 90077, 57378, 36579, 60980, 30481, 26382, 43883, 27884, 21285, 62386, 83587, 90088, 68589, 39690, 67291, 22092, 77693, 78494, 47095, 47396, 43497, 62198, 70199)}}'
    }
  ]
  
  
  const queryPrefix: string = "INSERT INTO `arts`.`families` (`id`, `image`, `index`, `name`, `serial`, `symbol`, `description`, `categoryId`) VALUES";
  let result: string = "";
  
  this.items.forEach((item) => {
      result += `${queryPrefix} ('${item.id}', '${item.image}', '${item.index}', '${item.name}', '${item.serial}', '${item.symbol}', '${item.description}', '${item.categoryId}'); \n` 
  })
  
  console.log(result);