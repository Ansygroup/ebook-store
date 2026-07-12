import BookCard from './BookCard';
import type { Book } from '../types';

interface Props {
  book: Book;
  index?: number;
}

// Shop grid uses the same card but keeps grid semantics clean for tests.
export default function ShopBookCard({ book, index }: Props) {
  return <BookCard book={book} index={index} />;
}
