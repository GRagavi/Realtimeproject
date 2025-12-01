# Page snapshot

```yaml
- generic [ref=e2]:
  - navigation [ref=e3]:
    - link "Movie App" [ref=e5] [cursor=pointer]:
      - /url: /
    - generic [ref=e6]:
      - link "Home" [ref=e7] [cursor=pointer]:
        - /url: /
      - link "Favourites" [ref=e8] [cursor=pointer]:
        - /url: /favourites
  - main [ref=e9]:
    - generic [ref=e10]:
      - generic [ref=e11]:
        - textbox "Search for movies..." [ref=e12]: inception
        - button "Search" [active] [ref=e13] [cursor=pointer]
      - generic [ref=e14]: Loading...
```