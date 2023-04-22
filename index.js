fetch('mods.txt')
    .then(response => response.text())
    .then(mods =>
    {
        console.log(mods);
    })
    .catch(error =>
    {
        console.error('Failed to fetch mods.txt', error);
    });
