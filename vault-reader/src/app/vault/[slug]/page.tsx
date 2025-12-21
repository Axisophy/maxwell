import { notFound } from 'next/navigation'
import { getVaultBook, getAllVaultBooks } from '@/lib/vault-content'
import BookReader from '@/components/BookReader'

interface PageProps {
  params: { slug: string }
}

// Generate static paths for all vault books
export async function generateStaticParams() {
  const books = getAllVaultBooks()
  return books.map(book => ({ slug: book.slug }))
}

// Generate metadata for each book
export async function generateMetadata({ params }: PageProps) {
  const book = getVaultBook(params.slug)
  
  if (!book) {
    return { title: 'Not Found | MXWLL Vault' }
  }
  
  return {
    title: `${book.title} by ${book.author} | MXWLL Vault`,
    description: book.description || `Read ${book.title} by ${book.author} (${book.yearDisplay}) in the MXWLL Vault.`,
  }
}

export default function VaultBookPage({ params }: PageProps) {
  const book = getVaultBook(params.slug)
  
  if (!book) {
    notFound()
  }
  
  return <BookReader book={book} />
}
