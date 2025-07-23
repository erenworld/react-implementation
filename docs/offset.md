L’offset d’un composant correspond au nombre d’éléments qui le précèdent dans son élément parent lorsque le nœud racine de sa vue est un fragment.

Autrement dit, si un composant commence par un fragment (par exemple, un <> ... </> en React), il peut contenir plusieurs éléments au niveau supérieur. L’offset désigne alors la position du premier de ces éléments dans la liste des enfants de l’élément parent.

C’est donc l’index du premier élément du composant dans l’ensemble des enfants de son parent.
