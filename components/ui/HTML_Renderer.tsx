export default function HTMLRenderer(props: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: props.html }} />;
}
