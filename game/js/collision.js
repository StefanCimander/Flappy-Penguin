function collision(elem1, elem2) {
    if (!elem1 || !elem2) return false;
    return elem1.getTransformedBounds().intersects(elem2.getTransformedBounds());
}